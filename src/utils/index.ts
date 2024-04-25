interface IframeType {
  dom: Element,
  src: string,
  onload: Function,
  onerror: Function,
  hidden: Boolean
}

/**
 * 判断变量是否为函数
 *  - Inspired:
 *    https://github.com/jashkenas/underscore/blob/master/modules/isFunction.js
 */
export function isFunction(functionToCheck: Function) {
  const getType = {}
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === '[object Function]'
  )
}

/**
 * 动态创建iframe
 * @param dom 创建iframe的容器，即在dom中创建iframe。dom可以是div、span或者其他标签。
 * @param src iframe中打开的网页路径
 * @param onload iframe加载完后触发该事件，可以为空
 * @param hidden 是否显示iframe
 * @return 返回创建的iframe对象
 */
export function createIframe({
  dom,
  src,
  onload,
  onerror,
  hidden = false }: IframeType): Element {
  // 在document中创建iframe
  const iframe: any = document.createElement('iframe')

  // 设置iframe的样式
  iframe.style.width = hidden ? '0' : '100%'
  iframe.style.height = hidden ? '0' : '100%'
  iframe.style.margin = '0'
  iframe.style.padding = '0'
  iframe.style.overflow = 'hidden'
  iframe.style.border = 'none'

  // 绑定iframe的onload事件
  if (isFunction(onload) || isFunction(onerror)) {
    if (iframe.attachEvent) {
      onload && iframe.attachEvent('onload', onload)
      onerror && iframe.attachEvent('onerror', onerror)
    } else if (iframe.addEventListener) {
      onload && iframe.addEventListener('load', onload)
      onerror && iframe.addEventListener('error', onerror)
    } else {
      onload && (iframe.onload = onload)
      onerror && (iframe.onerror = onerror)
    }
  }

  iframe.src = src
  // 把iframe加载到dom下面
  dom.appendChild(iframe)
  return iframe
}

/**
 * 销毁iframe，释放iframe所占用的内存。
 * @param iframe 需要销毁的iframe对象
 */
export function destroyIframe(iframe: any) {
  if (!iframe) return
  // 把iframe指向空白页面，这样可以释放大部分内存。
  iframe.src = 'about:blank'
  try {
    iframe.contentWindow.document.write('')
    iframe.contentWindow.document.clear()
  } catch (e) {
    console.error(e)
  }
  // 把iframe从页面移除
  iframe.parentNode.removeChild(iframe)
}

/**
 * 获取嵌套对象的所有对象的 key 对应 value值
 * @param {*} data 嵌套对象
 * @param {*} arr 存放属性数组
 * @param {*} children 保存嵌套子对象的属性
 * @param {*} key 获取的 value 对应的 key
 * @returns
 */
export function getChildValue(
  data: Array<T> = [],
  arr: Array<T> = [],
  key: string = '',
  children: string = 'children'
) {
  if (!key || data.length <= 0) return
  data.forEach(item => {
    if (item[children]) {
      getChildValue(item.children, arr, key, children)
    }
    arr.push(item[key])
  })
}
