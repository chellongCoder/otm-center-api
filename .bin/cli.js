#!/usr/bin/env node

/**
 * Usage
 * cli g model User
 * cli g controller User
 * cli g service User
 * cli g scaffold User name:string,phone:string,email:string
 */
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const createModel = async (name, props) => {
  console.log('create model...', name, props);
  const params = props.split(',').map(item => ({ name: item.split(':')[0], type: item.split(':')[1] }));
  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/model.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    className: capitalizeFirstLetter(name),
    props: params,
  });
  fs.writeFileSync(path.join(__dirname, `../src/models/${name}.model.ts`), content);
};
const createService = async (name, props) => {
  console.log('create service...', name, props);

  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/service.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    className: capitalizeFirstLetter(name),
  });
  fs.writeFileSync(path.join(__dirname, `../src/services/${name}.service.ts`), content);
};
const createController = async (name, props) => {
  console.log('create controller...', name, props);

  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/controller.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    className: capitalizeFirstLetter(name),
  });
  fs.writeFileSync(path.join(__dirname, `../src/controllers/${name}.controller.ts`), content);
};
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
(async () => {
  const args = process.argv.slice(2);
  if (args[0] === 'g' || args[0] === 'generate') {
    if (args[1] === 'm' || args[1] === 'model') {
      createModel(args[2], args[3]);
    } else if (args[1] === 's' || args[1] === 'service') {
      createService(args[2]);
    } else if (args[1] === 'c' || args[1] === 'controller') {
      createController(args[2]);
    } else if (args[1] === 'scaffold') {
      createModel(args[2], args[3]);
      createService(args[2]);
      createController(args[2]);
    } else {
      console.log('command invalid');
    }
  } else {
    console.log('command invalid');
  }
})();
