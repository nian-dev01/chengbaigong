// utils/db.js 基于wx.storage的简易数据层
function getTable(name) {
  return wx.getStorageSync('db_' + name) || [];
}

function setTable(name, data) {
  wx.setStorageSync('db_' + name, data);
}

function query(name, filter) {
  const list = getTable(name);
  if (!filter) return list.slice();
  return list.filter(filter);
}

function findOne(name, filter) {
  const list = getTable(name);
  return list.find(filter) || null;
}

function findById(name, id) {
  return findOne(name, item => String(item.id) === String(id));
}

function insert(name, item) {
  const list = getTable(name);
  list.unshift(item);
  setTable(name, list);
  return item;
}

function update(name, id, patch) {
  const list = getTable(name);
  const idx = list.findIndex(item => String(item.id) === String(id));
  if (idx >= 0) {
    list[idx] = Object.assign({}, list[idx], patch);
    setTable(name, list);
    return list[idx];
  }
  return null;
}

function remove(name, id) {
  const list = getTable(name);
  const idx = list.findIndex(item => String(item.id) === String(id));
  if (idx >= 0) {
    list.splice(idx, 1);
    setTable(name, list);
    return true;
  }
  return false;
}

function removeBy(name, filter) {
  const list = getTable(name);
  const next = list.filter(item => !filter(item));
  setTable(name, next);
}

function count(name, filter) {
  return query(name, filter).length;
}

module.exports = { getTable, setTable, query, findOne, findById, insert, update, remove, removeBy, count };
