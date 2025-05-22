import QueryBuilder from "../utils/QueryBuilder";
class Patient {
  getTherapistsList() {
    query = "SELECT * FROM Therapists;";
    return QueryBuilder.query(query);
  }
}
