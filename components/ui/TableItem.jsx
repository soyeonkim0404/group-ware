import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TableItem = ({ getTableData, children }) => {
  const bodyData =
    Array.isArray(getTableData.columns) && getTableData.columns.length && getTableData
      ? getTableData.columns[0]
      : {};
  const resultData = Object.keys(bodyData);

  const numberUnit = (ele) => {
    return ele.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <TableContainer>
      {getTableData ? (
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <colgroup>{children}</colgroup>
          {getTableData.tableHeads && (
            <TableHead>
              <TableRow>
                {getTableData.tableHeads.map((item, index) => (
                  <TableCell key={index}>{item}</TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {getTableData.columns.map((item) => (
              <StyledTableRow key={item.name}>
                {resultData.map((result, idx) => {
                  if (!isNaN(item[result])) {
                    return <TableCell key={idx}>{numberUnit(item[result])}</TableCell>;
                  } else if (result === 'link') {
                    return (
                      <TableCell key={idx}>
                        <Link href={item[result]}>
                          <a>{item[result]}</a>
                        </Link>
                      </TableCell>
                    );
                  } else {
                    return <TableCell key={idx}>{item[result]}</TableCell>;
                  }
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="table">
          {children}
        </Table>
      )}
    </TableContainer>
  );
};

TableItem.defaultProps = {
  custom: false,
  getTableData: false,
};

export default TableItem;
