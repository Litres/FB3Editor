/**
 * Элемент абзаца.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.PElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'p',
		xmlTag: 'p',
		cls: 'el-p',

		setAttributesHtml: function (element)
		{
			var me = this,
				children = me.children,
				first;

			first = children.length ? children[0] : null;
			if (first instanceof FBEditor.editor.element.ImgElement)
			{
				me.cls += ' el-parent-image';
			}
			element = me.callParent(arguments);

			return element;
		}
	}
);