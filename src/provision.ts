import db from './firestore';
import { Card } from './types/Card';

const write = async (card: Card) => {
  const res = await db.collection('Dominion').add(card);
  console.log(res);
};

const provisionCards = (cardList: Card[]) => {
  cardList.forEach((card: Card): void => {
    write(card);
  });
};

export default provisionCards;
