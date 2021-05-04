export const calenderDate = () => {
  let today = new Date();

  let dd = today.getDate();
  let mm = today.getMonth() + 1;

  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return yyyy + "/" + mm + "/" + dd;
};

export const templateDate = () => {
  let d = new Date();
  let a = d.toLocaleString();
  let currentDate = /[0-9]*:[0-9]*:[0-9]*/g.exec(JSON.stringify(a));
  let day = /[A-za-z]+ [A-za-z]+ [0-9]+/g.exec(JSON.stringify(a));
  let year = /[0-9][0-9][0-9][0-9]/g.exec(JSON.stringify(a));

  return `${day}  ${year}\n${currentDate}`;
};
