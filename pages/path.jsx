import Card, { CardLayout } from '@components/ui/Card';
import TableItem from '@components/ui/TableItem';
import { pathLink } from '@data/pageLink';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import styled from 'styled-components';
import Flag from '@components/ui/Flag';

const SLinkStyled = styled.a`
  color: ${(p) => p.theme.blue};
  text-decoration: underline;
  cursor: pointer;
`;

const Path = () => {
  const stateProgress = (item) => {
    switch (item) {
      case 'ing':
        return <Flag.Green>{item}</Flag.Green>;
      case 'done':
        return <Flag.Blue>{item}</Flag.Blue>;
      case 'danger':
        return <Flag.Orange>{item}</Flag.Orange>;
      default:
        return <Flag.Gray>none</Flag.Gray>;
    }
  };
  return (
    <CardLayout>
      <Card col="12">
        <Card.Body>
          <TableItem>
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                {pathLink.tableHeads.map((head, index) => (
                  <TableCell
                    align="center"
                    key={index}
                    sx={{ '&:first-of-type, &:nth-of-type(2)': { textAlign: 'left' } }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pathLink.columns.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                >
                  <TableCell align="left">{item.name}</TableCell>
                  <TableCell align="left">
                    <Link href={item.link}>
                      <SLinkStyled>{item.link}</SLinkStyled>
                    </Link>
                  </TableCell>
                  <TableCell align="center">{item.worker}</TableCell>
                  <TableCell align="center">{stateProgress(item.progress)}</TableCell>
                  <TableCell align="center">
                    {!item.type ? 'default' : item.type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableItem>
        </Card.Body>
      </Card>
    </CardLayout>
  );
};

export default Path;
