import { useSelector, useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Search = ({ showBtn = false }) => {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const navigate = useNavigate();

  const handleChange = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?${text}`);
  };

  return (
    <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        type="search"
        value={text}
        className={`form-control mr-sm-2 ${!showBtn ? 'w-100percent' : ''}`}
        placeholder="Search"
      />
      {showBtn && (
        <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
      )}
    </form>
  );
};

export default Search;
