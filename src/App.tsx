import { FC, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';

import './style.css';



function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {});

  return (
    <a type="button" className="linkButton" onClick={decoratedOnClick}>
      {children}
    </a>
  );
}

export const App = () => {
  const [posts, setPosts] = useState([]);
  let returnvalue = (
    <div>
      <div>
        <Accordion defaultActiveKey="-1">
          {posts.map((element, index) => (
            <Card>
              <Card.Header>
                <div>
                  {element.title + ' '}
                  <CustomToggle eventKey={'' + index}> See more</CustomToggle>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey={'' + index}>
                <Card.Body>
                  {element.body}.
                  <div>
                    Comment: {element.comments} | Contact: {element.email}
                  </div>{' '}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      </div>
    </div>
  );

  const getPosts = async () => {
    let finalArray= [];
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    finalArray = data;
    const responseusers = await fetch(
      'https://jsonplaceholder.typicode.com/users'
    );
    const datausers = await responseusers.json();
    for (let p = 0; p < finalArray.length; p++) {
      for (let u = 0; u < datausers.length; u++) {
        if (finalArray[p]['userId'] === datausers[u]['id']) {
          finalArray[p]['email'] = datausers[u]['email'];
          break;
        }
      }
    }
    const responsecomments = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    );
    const datacomments = await responsecomments.json();
    for (let i = 0; i < finalArray.length; i++) {
      let comments = 0;
      for (let u = 0; u < datacomments.length; u++) {
        if (finalArray[i]['id'] === datacomments[u]['postId']) {
          comments = comments + 1;
        }
      }
      finalArray[i]['comments'] = comments;
    }
    setPosts(finalArray);
  };

  useEffect(() => {
    if (posts.length === 0) {
      getPosts();
    }
  }, [posts]);

  return returnvalue;
};
