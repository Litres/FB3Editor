Ext.define('Ext.draw.sprite.Cross', {
    extend: 'Ext.draw.sprite.Path',
    alias: 'sprite.cross',

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
        var s = attr.size / 1.7,
            x = attr.x - attr.lineWidth / 2,
            y = attr.y;
        path.fromSvgString('M'.concat(x - s, ',', y, 'l', [-s, -s, s, -s, s, s, s, -s, s, s, -s, s, s, s, -s, s, -s, -s, -s, s, -s, -s, 'z']));
    }

});