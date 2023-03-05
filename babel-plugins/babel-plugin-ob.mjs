import { declare } from '@babel/helper-plugin-utils';

const ob = declare((api, options, dirname) => {
  api.assertVersion(7);
  const t = api.types;

  return {
    visitor: {
      FunctionDeclaration(path, state) {
        const blockStatement = path.node.body;
        const statements = blockStatement.body.map((v, i) => {
          return { index: i, value: v };
        });
        let i = statements.length;

        // 打乱statements的顺序
        while (i) {
          let j = Math.floor(Math.random() * i--);
          [statements[i], statements[j]] = [statements[j], statements[i]];
        }

        const dispenseArr = [];
        const cases = [];
        statements.forEach((v, i) => {
          dispenseArr[v.index] = i;
          // 生成
          // case 1:
          //   var d = c + 1;
          //   continue;
          const switchCase = t.switchCase(t.numericLiteral(i), [
            v.value,
            t.continueStatement()
          ]);
          cases.push(switchCase);
        });

        // 生成 "4|2|3|1|0"
        const dispenseStr = dispenseArr.join('|');

        // 生成 '_array'
        const array = path.scope.generateUidIdentifier('array');
        // 生成 '_index'
        const index = path.scope.generateUidIdentifier('index');

        // 生成 "4|2|3|1|0".split
        const callee = t.memberExpression(
          t.stringLiteral(dispenseStr),
          t.identifier('split')
        );

        // 生成 '3|2|1|4'.split('|')
        const arrayInit = t.callExpression(callee, [t.stringLiteral('|')]);

        // 生成 _array = '3|2|1|4'.split('|')
        const varArray = t.variableDeclarator(array, arrayInit);

        // 生成 _index = 0
        const varIndex = t.variableDeclarator(index, t.numericLiteral(0));

        // 生成 var _array = '3|2|1|4'.split('|'), _index = 0;
        const declaration = t.variableDeclaration('var', [varArray, varIndex]);
        // 生成 _index++
        const indexPlusPlus = t.updateExpression('++', index);
        // 生成 _array[_index++]
        const switchMemberExpression = t.memberExpression(
          array,
          indexPlusPlus,
          true
        );
        // 生成 +_array[_index++]
        const discriminant = t.unaryExpression('+', switchMemberExpression);

        // 生成
        // switch (+_array[_index++]) {
        // ...
        // }
        const switchStatement = t.switchStatement(discriminant, cases);

        // 生成 !![]
        const whileCondition = t.unaryExpression(
          '!',
          t.unaryExpression('!', t.arrayExpression())
        );

        // 生成
        // while (!![]) {
        // ...
        // break;
        // }
        const whileStatement = t.whileStatement(
          whileCondition,
          t.blockStatement([switchStatement, t.breakStatement()])
        );

        // 节点替换
        path
          .get('body')
          .replaceWith(t.blockStatement([declaration, whileStatement]));
      }
    }
  };
});

export default ob;
