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
const { Parser } = require('@dbml/core');
const { exec } = require('child_process');
const currentBranch = async () => new Promise((resolve, reject) => {
  exec('git symbolic-ref --short -q HEAD', (error, stdout, stderr) => {
    if (error) reject(error);
    resolve(stdout.trim());
  });
});
const cleanAndBuild = async () => new Promise((resolve, reject) => {
  exec('rm -rf dist && yarn build', (error, stdout, stderr) => {
    if (error) reject(error);
    resolve(stdout.trim());
  });
})
const typeMapping = {
  uuid: 'string',
  integer: 'number',
  number: 'number',
  int: 'number',
  double: 'number',
  decimal: 'number',
  varchar: 'string',
  char: 'string',
  text: 'string',
  datetime: 'Date',
  date: 'Date',
  time: 'Date',
  timestamp: 'Date',
  boolean: 'boolean'
};
const excludeColumns = [
  'id',
  'created_at',
  'updated_at',
  'deleted_at',
  'created_by',
  'updated_by',
  'deleted_by',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'createdBy',
  'updatedBy',
  'deletedBy',
];
const toCamelCased = s => s.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
const toFileName = s => s.replaceAll('_', '-');
const createModel = async (name, props) => {
  console.log('create model...', name, props);
  const params = props.split(',').map(item => ({ columnName: item.split(':')[0], name: toCamelCased(item.split(':')[0]), type: item.split(':')[1] }));
  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/model.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    className: capitalizeFirstLetter(toCamelCased(name)),
    props: params,
  });
  fs.writeFileSync(path.join(__dirname, `../src/models/${toFileName(name)}.model.ts`), content);
};
const createService = async (name, props) => {
  console.log('create service...', name, props);

  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/service.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    fileName: toFileName(name),
    className: capitalizeFirstLetter(toCamelCased(name)),
  });
  fs.writeFileSync(path.join(__dirname, `../src/services/${toFileName(name)}.service.ts`), content);
};
const createController = async (name, props) => {
  console.log('create controller...', name, props);

  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/controller.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    fileName: toFileName(name),
    className: capitalizeFirstLetter(toCamelCased(name)),
  });
  fs.writeFileSync(path.join(__dirname, `../src/controllers/${toFileName(name)}.controller.ts`), content);
};
const createFactory = async (name, props) => {
  console.log('create factory...', name, props);

  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/factory.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    className: capitalizeFirstLetter(name),
  });
  fs.writeFileSync(path.join(__dirname, `../src/database/factories/${name}.factory.ts`), content);
};
const createSeed = async (name, props) => {
  console.log('create seed...', name, props);

  const fileContent = fs.readFileSync(path.join(__dirname, 'tmp/seed.ejs'), 'utf8');
  const content = ejs.render(fileContent, {
    name,
    className: capitalizeFirstLetter(name),
  });
  fs.writeFileSync(path.join(__dirname, `../src/database/seeds/create-${name}.seed.ts`), content);
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
    } else if (args[1] === 'f' || args[1] === 'factory') {
      createFactory(args[2]);
    } else if (args[1] === 'sd' || args[1] === 'seed') {
      createSeed(args[2]);
    } else if (args[1] === 'scaffold') {
      createModel(args[2], args[3]);
      createService(args[2]);
      createController(args[2]);
    } else {
      const schemaPath = path.join(__dirname, '../schema.dbml');
      const schemaExist = fs.existsSync(schemaPath);
      if (!schemaExist) {
        console.log('command invalid');
      } else {
        const dbml = fs.readFileSync(schemaPath, 'utf-8');
        const database = Parser.parse(dbml, 'dbml');
        const schema = database.schemas[0];
        schema.tables.forEach(item => {
          const tableName = item.name;
          const fields = item.fields
            .map(f => {
              if (excludeColumns.indexOf(f.name) > -1) return null;
              return `${f.name}:${typeMapping[f.type.type_name]}`;
            })
            .filter(item => item != null)
            .join(',');
          // createModel(tableName, fields);
          // createService(tableName);
          createController(tableName);
        });
      }
    }
  } else if (args[0] === 'd' || args[0] === 'deploy') {
    const branch = await currentBranch();
    console.log(await cleanAndBuild());
    //=========
    // TODO 
    // 1. s
    // 
  } else {
    console.log('command invalid');
  }
})();
