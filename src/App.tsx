import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import db from './firestore';
import { Card } from './types/Card';
import { Box } from './types/Box';
import Table from './components/Table';
import { RadioButtonUnchecked, CheckCircle } from '@material-ui/icons';

function App() {
  const { handleSubmit } = useForm();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxChoices, setBoxChoices] = useState<{ [key: string]: boolean }>({});
  const [loadedPickableCards, setLoadedPickableCards] = useState<Card[]>([]);
  const [kingdomCards, setKingdomCards] = useState<Card[]>([]);

  const pickCards = () => {
    const shuffledLoadedPickableCards = _.shuffle(loadedPickableCards);
    let pickedCards = [];
    for (let i = 0; i < 10; i++) {
      pickedCards.push(shuffledLoadedPickableCards[i]);
    }
    setKingdomCards(pickedCards);
  };

  const onSubmit = async () => {
    let chosenBoxes: string[] = [];
    for (const key in boxChoices) {
      if (boxChoices[key]) {
        chosenBoxes.push(key);
      }
    }

    const boxedCards = await getPickableCards(chosenBoxes);
    setLoadedPickableCards(boxedCards);
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let changingBoxChoices = boxChoices;
    let addition: { [key: string]: boolean } = {};
    addition[e.target.name] = e.target.checked;
    _.merge(changingBoxChoices, addition);
    setBoxChoices(changingBoxChoices);
  };

  const getBoxes = async () => {
    const boxesRef = db.collection('Boxes');
    const snapshot = await boxesRef.get();

    let results: Box[] = [];
    snapshot.forEach((doc) => {
      const box: Box = doc.data() as Box;
      results.push(box);
    });
    results.sort((boxA, boxB) => {
      return boxA.order - boxB.order;
    });
    setBoxes(results);
  };

  const getPickableCards = async (chosenBoxes: string[]) => {
    const dominionRef = db.collection('Dominion');
    let boxedCards: Card[] = [];
    for (const box of chosenBoxes) {
      const snapshot = await dominionRef
        .where('box', '==', box)
        .where('pickable', '==', 'Card')
        .get();

      let results: Card[] = [];
      snapshot.forEach((doc) => {
        const card: Card = doc.data() as Card;
        results.push(card);
      });
      const newBoxedCards = _.concat(boxedCards, results);
      boxedCards = newBoxedCards;
    }

    return boxedCards;
  };

  useEffect(() => {
    getBoxes();
  }, []);

  useEffect(() => {
    pickCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedPickableCards]);

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        &nbsp;
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h6">Dominion Kingdom Picker</Typography>
      </Grid>
      <Grid container item xs={10}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} item xs={12}>
            <Grid item xs={12}>
              {boxes.map((box) => {
                return (
                  <FormControlLabel
                    key={box.order}
                    control={
                      <Checkbox
                        defaultChecked={false}
                        onChange={(e) => onCheckboxChange(e)}
                        icon={<RadioButtonUnchecked fontSize="large" />}
                        checkedIcon={<CheckCircle fontSize="large" />}
                      />
                    }
                    name={box.name}
                    label={<Typography variant="body1">{box.name}</Typography>}
                    labelPlacement="start"
                  />
                );
              })}
            </Grid>
            <Grid container justify="center" item xs={12}>
              <Button variant="contained" type="submit">
                Get Kingdom
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item xs={11}>
        <Table cards={kingdomCards} />
      </Grid>
    </Grid>
  );
}

export default App;
