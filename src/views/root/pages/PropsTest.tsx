import { PropsTestType } from "@/types";

const PropsTest = ({ props }: { props: PropsTestType }) => {
  const PropsTest = (e: string) => {
    props.testSet(e);
  };

  return (
    <div>
      <button
        onClick={() => {
          window.alert(props.test1);
        }}
      >
        test1
      </button>
      <button
        onClick={() => {
          window.alert(props.test2);
        }}
      >
        test2
      </button>
      <input
        className="text-black"
        onChange={(e) => {
          PropsTest(e.target.value);
        }}
      ></input>
    </div>
  );
};

export default PropsTest;
