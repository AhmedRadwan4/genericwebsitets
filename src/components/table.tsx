import * as React from "react";

interface TableHeaderProps {
  sampleRow: Record<string, any>;
}

const TableHeader = (props: TableHeaderProps): JSX.Element => {
  return (
    <tr>
      {Object.keys(props.sampleRow).map((key, index) => (
        <th scope="col" className="" key={key}>
          <p className="group flex justify-between items-center">{key}</p>
        </th>
      ))}
    </tr>
  );
};

interface TableRowProps {
  row: Record<string, any>;
}

const TableRow = (props: TableRowProps): JSX.Element => {
  return (
    <tr>
      {Object.keys(props.row).map((key) => (
        <td key={key} className="py-2 px-3 text-lg text-gray-900">
          {props.row[key]}
        </td>
      ))}
    </tr>
  );
};

interface TableProps {
  rows: Array<Record<string, any>>;
}

export const Table = (props: TableProps): JSX.Element => {
  // if we do not have y data we cannot render even the header
  if (!props.rows || props.rows.length === 0) {
    return <div> No data to show</div>;
  }
  return (
    <table>
      <TableHeader sampleRow={props.rows[0]} />
      {props.rows.map((row) => (
        // eslint-disable-next-line react/jsx-key
        <TableRow row={row} />
      ))}
    </table>
  );
};
