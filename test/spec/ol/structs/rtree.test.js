goog.provide('ol.test.structs.RTree');


describe('ol.structs.RTree', function() {

  var rTree = new ol.structs.RTree();

  describe('creation', function() {
    it('can insert 1k objects', function() {
      var i = 1000;
      while (i > 0) {
        var bounds = new Array(4);
        bounds[0] = Math.random() * 10000;
        bounds[1] = bounds[0] + Math.random() * 500;
        bounds[2] = Math.random() * 10000;
        bounds[3] = bounds[2] + Math.random() * 500;
        rTree.insert(bounds, 'JUST A TEST OBJECT!_' + i);
        i--;
      }
      expect(goog.object.getCount(rTree.search([0, 10600, 0, 10600])))
          .to.be(1000);
    });
    it('can insert 1k more objects', function() {
      var i = 1000;
      while (i > 0) {
        var bounds = new Array(4);
        bounds[0] = Math.random() * 10000;
        bounds[1] = bounds[0] + Math.random() * 500;
        bounds[2] = Math.random() * 10000;
        bounds[3] = bounds[2] + Math.random() * 500;
        rTree.insert(bounds, 'JUST A TEST OBJECT!_' + i);
        i--;
      }
      expect(goog.object.getCount(rTree.search([0, 10600, 0, 10600])))
          .to.be(2000);
    });
  });

  describe('search', function() {
    it('can perform 1k out-of-bounds searches', function() {
      var i = 1000;
      var len = 0;
      while (i > 0) {
        var bounds = new Array(4);
        bounds[0] = -(Math.random() * 10000 + 501);
        bounds[1] = bounds[0] + Math.random() * 500;
        bounds[2] = -(Math.random() * 10000 + 501);
        bounds[3] = bounds[2] + Math.random() * 500;
        len += rTree.search(bounds).length;
        i--;
      }
      expect(len).to.be(0);
    });
    it('can perform 1k in-bounds searches', function() {
      var i = 1000;
      var len = 0;
      while (i > 0) {
        var bounds = new Array(4);
        bounds[0] = Math.random() * 10000;
        bounds[1] = bounds[0] + Math.random() * 500;
        bounds[2] = Math.random() * 10000;
        bounds[3] = bounds[2] + Math.random() * 500;
        len += rTree.search(bounds).length;
        i--;
      }
      expect(len).not.to.be(0);
    });
  });

  describe('deletion', function() {
    var len = 0;
    it('can delete half the RTree', function() {
      var bounds = [5000, 10500, 0, 10500];
      len += rTree.remove(bounds).length;
      expect(len).to.not.be(0);
    });
    it('can delete the other half of the RTree', function() {
      var bounds = [0, 5000, 0, 10500];
      len += rTree.remove(bounds).length;
      expect(len).to.be(2000);
    });
  });

  describe('result plausibility and structure', function() {

    it('filters by rectangle', function() {
      rTree.insert([0, 1, 0, 1], 1);
      rTree.insert([1, 4, 1, 4], 2);
      rTree.insert([2, 3, 2, 3], 3);
      rTree.insert([-5, -4, -5, -4], 4);
      rTree.insert([-4, -1, -4, -1], 5);
      rTree.insert([-3, -2, -3, -2], 6);

      var result;
      result = goog.object.getValues(rTree.search([2, 3, 2, 3]));
      expect(result).to.contain(2);
      expect(result).to.contain(3);
      expect(result.length).to.be(2);
      result = goog.object.getValues(rTree.search([-1, 2, -1, 2]));
      expect(result).to.contain(1);
      expect(result).to.contain(2);
      expect(result).to.contain(3);
      expect(result).to.contain(5);
      expect(result.length).to.be(4);
      expect(goog.object.getCount(rTree.search([5, 6, 5, 6]))).to.be(0);
    });

    it('filters by type', function() {
      rTree.insert([2, 3, 2, 3], 7, 'type1');

      var result;
      result = rTree.search([1, 4, 2, 4], 'type1');
      expect(result).to.contain(7);
      expect(result.length).to.be(1);
      result = rTree.search([1, 4, 2, 4]);
      expect(result.length).to.be(3);
    });

    it('can return objects instead of arrays', function() {
      var obj = {foo: 'bar'};
      rTree.insert([5, 5, 5, 5], obj);
      var result = rTree.searchReturningObject([4, 6, 4, 6]);
      expect(result[goog.getUid(obj)]).to.equal(obj);
    });

  });

});

goog.require('goog.object');
goog.require('ol.structs.RTree');
