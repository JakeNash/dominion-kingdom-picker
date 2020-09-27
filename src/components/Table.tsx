import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
} from '@material-ui/core';

import { Card } from '../types/Card';

type TableProps = {
  cards: Card[];
};

const useStyles = makeStyles({
  table: {},
});

const Table = ({ cards }: TableProps) => {
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const ascendingCompare = (a: Card, b: Card) => {
    if (a[orderBy] > b[orderBy]) return 1;
    if (a[orderBy] < b[orderBy]) return -1;
    return 0;
  };

  const descendingCompare = (a: Card, b: Card) => {
    if (a[orderBy] > b[orderBy]) return -1;
    if (a[orderBy] < b[orderBy]) return 1;
    return 0;
  };

  const handleSort = (tableHeader: string) => {
    if (orderBy !== tableHeader) {
      setOrderBy(tableHeader);
    } else {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    }
  };

  if (
    cards.length > 0 &&
    cards.every((element) => typeof element !== 'undefined')
  ) {
    return (
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <MuiTable className={classes.table} aria-label="card table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel onClick={() => handleSort('name')}>
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel onClick={() => handleSort('box')}>
                    Box
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel onClick={() => handleSort('cost')}>
                    Cost
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel onClick={() => handleSort('cardType')}>
                    Card Type
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel onClick={() => handleSort('setup')}>
                    Setup
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards
                .sort(order === 'asc' ? ascendingCompare : descendingCompare)
                .map((card) => (
                  <TableRow key={card.name}>
                    <TableCell component="th" scope="row">
                      {card.name}
                    </TableCell>
                    <TableCell align="right">{card.box}</TableCell>
                    <TableCell align="right">{card.cost}</TableCell>
                    <TableCell align="right">
                      {card.cardType.replace(/\|/g, ', ')}
                    </TableCell>
                    <TableCell align="right">
                      {card.setup.replace(/\|/g, ', ')}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </Grid>
    );
  } else {
    return <div></div>;
  }
};

export default Table;
