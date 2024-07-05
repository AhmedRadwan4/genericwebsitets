export default async function Users() {
  return (
    <div className="container">
      <select name="toys" id="toy-id" className="select-input">
        <optgroup label="Musical toys">
          <option value="Dancing Doll">Dancing Doll</option>
          <option value="Alphabet laptop">Alphabet laptop</option>
        </optgroup>
        <optgroup label="Remote toys">
          <option value="Robots">Robots</option>
          <option value="Transformers">Transformers</option>
        </optgroup>
      </select>
    </div>
  );
}
