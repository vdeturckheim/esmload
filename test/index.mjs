import * as Assert from 'assert';
import { main, TEST_MOCK } from './lib1.mjs';
import * as Lib2 from './lib2';


Assert.equal(main(), 'hello World!');
TEST_MOCK.get('main').apply = function (target, self, arg) {

    return Reflect.apply(target, self, arg) + '!!';
};
Assert.equal(main(), 'hello World!!!');
TEST_MOCK.get('main').apply = undefined;
Assert.equal(main(), 'hello World!');

Assert.equal(Lib2.VALUES.NB, 10);
Lib2.TEST_MOCK.get('VALUES').get = function () {
    return 20;
};
Assert.equal(Lib2.VALUES.NB, 20);
Lib2.TEST_MOCK.get('VALUES').get = undefined;
Assert.equal(Lib2.VALUES.NB, 10);
