Ext.define('Ext.draw.sprite.Plus', {
    extend: 'Ext.draw.sprite.Path',
    alias: 'sprite.plus',

    inheritableStatics: {
        def: {
            processors: {
                x: 'number',
                y: 'number',
                /**
                 * @cfg {Number} [size=4] The size of the sprite.
                 * Meant to be comparable to the size of a circle sprite with the same radius.
                 */
                size: 'number'
            },
            defaults: {
                x: 0,
                y: 0,
                size: 4
            },
            dirtyTriggers: {
                x: 'path',
                y: 'path',
                size: 'path'
            }
        }
    },

    updatePath: function (path, attr) {
        var s = attr.size / 1.3,
            x = attr.x - attr.lineWidth / 2,
            y = attr.y;
        path.fromSvgString('M'.concat(x - s / 2, ',', y - s / 2, 'l', [0, -s, s, 0, 0, s, s, 0, 0, s, -s, 0, 0, s, -s, 0, 0, -s, -s, 0, 0, -s, 'z']));
    }

});