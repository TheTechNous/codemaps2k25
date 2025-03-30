const Loader = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-bg-color-2">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <style>
        {`
          .spinner {
            width: 20.2px;
            height: 20.2px;
          }

          .spinner div {
            width: 100%;
            height: 100%;
            background-color: #ea5652;
            border-radius: 50%;
            animation: spinner-4t3wzl 1.25s infinite backwards;
          }

          .spinner div:nth-child(1) {
            animation-delay: 0.15s;
            background-color: rgba(234, 86, 82, 0.9);
          }

          .spinner div:nth-child(2) {
            animation-delay: 0.3s;
            background-color: rgba(234, 86, 82, 0.8);
          }

          .spinner div:nth-child(3) {
            animation-delay: 0.45s;
            background-color: rgba(234, 86, 82, 0.7);
          }

          .spinner div:nth-child(4) {
            animation-delay: 0.6s;
            background-color: rgba(234, 86, 82, 0.6);
          }

          .spinner div:nth-child(5) {
            animation-delay: 0.75s;
            background-color: rgba(234, 86, 82, 0.5);
          }

          @keyframes spinner-4t3wzl {
            0% {
                transform: rotate(0deg) translateY(-200%);
            }

            60%, 100% {
                transform: rotate(360deg) translateY(-200%);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Loader
