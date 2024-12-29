export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
        <style jsx>{`
          .spinner {
            width: 70px;
            text-align: center;
          }

          .spinner > div {
            width: 12px;
            height: 12px;
            background-color: #4f46e5;
            border-radius: 100%;
            display: inline-block;
            margin: 0 2px;
            -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
            animation: sk-bouncedelay 1.4s infinite ease-in-out both;
          }

          .spinner .bounce1 {
            background-color: #6366f1;
            -webkit-animation-delay: -0.32s;
            animation-delay: -0.32s;
          }

          .spinner .bounce2 {
            background-color: #818cf8;
            -webkit-animation-delay: -0.16s;
            animation-delay: -0.16s;
          }

          .spinner .bounce3 {
            background-color: #a5b4fc;
          }

          @-webkit-keyframes sk-bouncedelay {
            0%, 80%, 100% {
              -webkit-transform: scale(0);
            }
            40% {
              -webkit-transform: scale(1.0);
            }
          }

          @keyframes sk-bouncedelay {
            0%, 80%, 100% {
              -webkit-transform: scale(0);
              transform: scale(0);
            }
            40% {
              -webkit-transform: scale(1.0);
              transform: scale(1.0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}