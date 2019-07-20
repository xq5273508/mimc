module.exports = function (content, map, meta) {
  content = content.replace(/(this.send(Group)?Message\s*=\s*function\s*\(\w,\s*\w,\s*\w,\s*\w)(\)\s*\{[^}]*)\.setPacketid\(\w+\)([^}]*\})/ig, "$1,$d$3.setPacketid($d)$4");
  return `${content}
function factory(){
  return  {
    "MIMCUser": MIMCUser
  };
};`;
};