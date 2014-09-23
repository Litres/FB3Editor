Ext.define('Ext.draw.sprite.Square', {
    extend: 'Ext.draw.sprite.Rect',
    alias: 'sprite.square',

    inheritableStatics: {
        def: {
            processors: {
                /**
                 * @cfg {Number} [size=4] The size of the sprite.
                 * Meant to be comparable to the size of a circle sprite with the same radius.
                 */
                size: 'number'
            },
            defaults: {
                size: 4
            },
            dirtyTriggers: {
                size: 'size'
            },
            updaters: {
                size: function (attr) {
                    var size = attr.size,
                        halfLineWidth = attr.lineWidth / 2;
                    this.setAttributes({
                        x: attr.x - size - halfLineWidth,
                        y: attr.y - size,
                        height: 2 * size,
                        width: 2 * size
                    });
                }
            }
        }
    }

});