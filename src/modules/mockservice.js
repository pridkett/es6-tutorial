let rates = [
  {
    "name": "30 years fixed",
    "rate": "4.25",
    "years": "30"
  },
  {
    "name": "20 years fixed",
    "rate": "3.25",
    "years": "20"
  },
  {
    "name": "15 years fixed",
    "rate": "2.75",
    "years": "15"
  }
];

export let findAll = () => new Promise((resolve, reject) => {
  if (rates) {
    resolve(rates);
  } else {
    reject("No rates");
  }
});
