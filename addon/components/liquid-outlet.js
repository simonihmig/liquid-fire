import Ember from "ember";
import layout from 'liquid-fire/templates/components/liquid-outlet';
import {
  childRoute,
  routeIsStable,
  modelIsStable
} from 'liquid-fire/ember-internals';

var LiquidOutlet = Ember.Component.extend({
  layout,
  positionalParams: ['inputOutletName'], // needed for Ember 1.13.[0-5] and 2.0.0-beta.[1-3] support
  tagName: '',
  versionEquality: Ember.computed('outletName', 'watchModels', 'watchDeepRoutes', function() {
    let outletName = this.get('outletName');
    let watchModels = this.get('watchModels');
    let watchDeepRoutes = this.get('watchDeepRoutes');
    return function(oldValue, newValue) {
      let oldChild = childRoute(oldValue, outletName);
      let newChild = childRoute(newValue, outletName);
      if (watchDeepRoutes) {
        oldChild = deepestLeaf(oldChild);
        newChild = deepestLeaf(newChild);
      }
      return routeIsStable(oldChild, newChild) && (!watchModels || modelIsStable(oldChild, newChild));
    };
  }),
  didReceiveAttrs() {
    this._super();
    this.set('outletName', this.get('inputOutletName') || 'main');
  }
});

LiquidOutlet.reopenClass({
  positionalParams: ['inputOutletName']
});

export default LiquidOutlet;

export function deepestLeaf(routeInfo) {
  while (true) {
    let next = childRoute(routeInfo, 'main');
    if (!next) { return routeInfo; }
    routeInfo = next;
  }
}
