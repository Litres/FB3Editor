/**
 * Элемент marker.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.marker.MarkerElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'marker',
		xmlTag: 'marker',
		cls: 'el-marker',

		getNameTree: function ()
		{
			var me = this,
				name;

			name = me.callParent(arguments);

			if (me.children.length && me.children[0].xmlTag === 'img' && me.children[0].resource)
			{
				name += ' ' + me.children[0].resource.name;
			}

			return name;
		}
	}
);