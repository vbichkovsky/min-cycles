let expect = require('expect.js'),
    rewire = require('rewire'),
    cycles = rewire('../cycles'),
    cw_most = cycles.__get__('cw_most'), 
    ccw_most = cycles.__get__('ccw_most');

`
      a
       \
        b
      / | \
     c  d  e       `;

var [a,b,c,d,e] = [[0,0],[1,1],[0,2],[1,2],[2,2]];

suite('cw-most');

test('no adjacent', () => {
    expect(cw_most(a,b,[])).to.be(undefined);
});

test('one adjacent', () => {
    expect(cw_most(a,b,[e])).to.be(e);
});

test('one adjacent, same as starting point', () => {
    expect(cw_most(a,b,[a])).to.be(undefined);
});

test('starting at a', () => {
    expect(cw_most(a,b,[d,c,e])).to.be(c);
});

test('starting at c', () => {
    expect(cw_most(c,b,[a,d,e])).to.be(d);
});

test('starting at e', () => {
    expect(cw_most(e,b,[c,a,d])).to.be(a);
});

test('starting at d', () => {
    expect(cw_most(d,b,[c,a,e])).to.be(e);
});

test('undefined starting point', () => {
    expect(cw_most(undefined, b, [a,c,d,e])).to.be(e);
});

suite('ccw-most');

test('no adjacent', () => {
    expect(ccw_most(a,b,[])).to.be(undefined);
});

test('one adjacent', () => {
    expect(ccw_most(a,b,[e])).to.be(e);
});

test('one adjacent, same as starting point', () => {
    expect(cw_most(a,b,[a])).to.be(undefined);
});

test('starting at a', () => {
    expect(ccw_most(a,b,[d,c,e])).to.be(e);
});

test('starting at c', () => {
    expect(ccw_most(c,b,[a,d,e])).to.be(a);
});

test('starting at e', () => {
    expect(ccw_most(e,b,[c,a,d])).to.be(d);
});

test('starting at d', () => {
    expect(ccw_most(d,b,[c,a,e])).to.be(c);
});

test('undefined starting point', () => {
    expect(ccw_most(undefined, b, [a,c,d,e])).to.be(c);
});
