export function getRootPath() {
  // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
  const curWwwPath = window.location.href
  // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
  const pathName = window.location.pathname
  const pos = curWwwPath.indexOf(pathName)
  // 获取主机地址，如： http://localhost:8083
  const localhostPaht = curWwwPath.substring(0, pos)
  // 获取带"/"的项目名，如：/uimcardprj
  const projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
  return (localhostPaht + projectName)
}

export function isWwwLink(link) {
  if (!link) {
    return false
  }
  const match = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
  return match.test(link)
}
