import { CircleHelp, Users } from "lucide-react";

function Progress({ goal, value }: { goal: number; value: number }) {
  const percentageValue = (value / goal) * 100;
  const percentage = percentageValue > 100 ? 100 : percentageValue;

  return (
    <>
      <div className="relative  flex flex-nowrap items-center">
        <div className="relative flex select-none flex-col items-center justify-center">
          <svg className="relative flex h-24 w-24 -rotate-90 transform items-center justify-center">
            <circle
              className="text-slate-400"
              stroke="currentColor"
              strokeWidth="4"
              cx="50%"
              cy="50%"
              r="36"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="36"
              stroke="currentColor"
              id="robin"
              strokeLinecap="round"
              strokeWidth="4"
              strokeDasharray={Math.round(Math.PI * (2 * 48))}
              strokeDashoffset={
                Math.round(Math.PI * (2 * 48)) - (percentage / 100) * 302
              }
              fill="transparent"
              className="text-orange-500 transition-all duration-500"
            />
          </svg>
          <span className="absolute top-9 text-lg" id="robin1">
            {percentageValue.toFixed(0) + "%"}
          </span>
        </div>
        {/* 目標 */}
        <div className="flex-auto">
          <span className="text-gray-500">
            目標 NT$ {goal.toLocaleString()}
          </span>

          <h2 className="whitespace-nowrap text-2xl font-bold leading-relaxed ">
            <span className="sr-only">累計集資金額</span>
          </h2>
          <h3 className="js-sum-raised text-2xl font-bold">
            NT$ {value.toLocaleString()}
          </h3>

          {/* ========================= */}
          <ul className="flex">
            <li className="has-tooltip mr-3 flex cursor-default items-center">
              <h2 className="mr-1 inline-block">
                <Users />
              </h2>
              <h3 className="text-zec-green flex items-center text-lg font-bold ">
                <span className="js-backers-count">174</span>人
                <CircleHelp size={16} color="#2b913c" />
              </h3>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Progress;
