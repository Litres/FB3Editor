/**
 * Элемент изображения маркера.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.marker.img.ImgElement',
	{
		extend: 'FBEditor.editor.element.img.ImgElement',
		cls: 'el-img-marker',

		setNode: function (node)
		{
			var me = this;

			me.callParent(arguments);
			node.getElement = function ()
			{
				// ссылается на элемент, который содержит маркер
				return me.parent.parent;
			};
		}
	}
);