import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const QueryParamExample = () => {
  const query = useQuery();
  const param1 = query.get("param1");
  const param2 = query.get("param2");

  return (
    <div>
      <h1>Query Parameters Example</h1>
      <p>Param1: {param1}</p>
      <p>Param2: {param2}</p>
    </div>
  );
};

export default QueryParamExample;
