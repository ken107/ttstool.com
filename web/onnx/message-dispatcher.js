
function makeMessageDispatcher({ from, to, requestHandlers }) {
  const pendingRequests = new Map();
  return {
      waitForResponse(requestId) {
          let pending = pendingRequests.get(requestId);
          if (!pending)
              pendingRequests.set(requestId, pending = makePending());
          return pending.promise;
      },
      dispatch({ message, sender, sendResponse }) {
          if (message.from == from && message.to == to) {
              switch (message.type) {
                  case "request": return handleRequest(message, sender, sendResponse);
                  case "notification": return handleNotification(message, sender);
                  case "response": return handleResponse(message);
              }
          }
      },
      updateHandlers(newHandlers) {
          requestHandlers = newHandlers;
      }
  };
  function makePending() {
      const pending = {};
      pending.promise = new Promise((fulfill, reject) => {
          pending.fulfill = fulfill;
          pending.reject = reject;
      });
      return pending;
  }
  function handleRequest(req, sender, sendResponse) {
      if (requestHandlers[req.method]) {
          Promise.resolve()
              .then(() => requestHandlers[req.method](req.args || {}, sender))
              .then(result => sendResponse({ from: req.to, to: req.from, type: "response", id: req.id, result, error: undefined }), error => sendResponse({ from: req.to, to: req.from, type: "response", id: req.id, result: undefined, error }));
          //let caller know that sendResponse will be called asynchronously
          return true;
      }
      else {
          console.error("No handler for method", req);
      }
  }
  function handleNotification(ntf, sender) {
      if (requestHandlers[ntf.method]) {
          Promise.resolve()
              .then(() => requestHandlers[ntf.method](ntf.args || {}, sender))
              .catch(error => console.error("Failed to handle notification", ntf, error));
      }
      else {
          console.error("No handler for method", ntf);
      }
  }
  function handleResponse(res) {
      const pending = pendingRequests.get(res.id);
      if (pending) {
          pendingRequests.delete(res.id);
          if (res.error)
              pending.reject(res.error);
          else
              pending.fulfill(res.result);
      }
      else {
          console.error("Stray response", res);
      }
  }
}
