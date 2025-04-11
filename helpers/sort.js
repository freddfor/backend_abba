const sortBuilder = (sortBy = "id", sortDesc = "ASC") => {
  orderBy = sortDesc === "ASC" || sortDesc === "" ? "ASC" : "DESC";
  sortBy = sortBy === "" ? "id" : sortBy;
  return { sortBy, orderBy };
};

module.exports = {
  sortBuilder,
};
