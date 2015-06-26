/**
 * Элемент абзаца.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.p.PElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.p.PElementController'
		],
		controllerClass: 'FBEditor.editor.element.p.PElementController',
		htmlTag: 'p',
		xmlTag: 'p',
		cls: 'el-p',
		showedOnTree: false,

		isP: true,

		setAttributesHtml: function (element)
		{
			var me = this,
				children = me.children,
				first;

			first = children.length ? children[0] : null;
			if (first instanceof FBEditor.editor.element.img.ImgElement)
			{
				me.cls += ' el-p-no-indent';
			}
			element = me.callParent(arguments);

			return element;
		}
	}
);