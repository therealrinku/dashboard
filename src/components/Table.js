import "../styles/table.css";

export default function Table({ tableContents, tableHeaders }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Sn</th>
          {tableHeaders.map((header) => {
            return <th key={header}>{header}</th>;
          })}
        </tr>
      </thead>

      <tbody style={tableContents.length < 1 ? { width: "100%" } : undefined}>
        {tableContents.map((content, i) => {
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              {content.map((value, j) => {
                return <td key={j}>{value}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
