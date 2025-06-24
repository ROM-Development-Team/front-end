import { useParams } from 'react-router-dom';
import AnonymousRantForm from '../pages/anonymousRant';

const AnonymousRantWrapper = () => {
  const { username } = useParams();
  return <AnonymousRantForm username={username} />;
};

export default AnonymousRantWrapper;