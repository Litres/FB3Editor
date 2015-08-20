/**
 * Неопределенный элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.undefined.UndefinedElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'undefined',
		xmlTag: 'undefined',
		cls: 'el-undefined',

		/**
		 * @property {String} Реальное имя элемента.
		 */
		realName: '',

		isUndefined: true,

		constructor: function (realName, attributes, children)
		{
			var me = this,
				n;

			me.realName = realName;
			n = realName;//realName.replace(/-([a-z])/g, '$1');
			me.htmlTag = n;
			me.xmlTag = n;
			me.callParent([attributes, children]);
		},

		convertToText: function (fragment)
		{
			//
		}
	}
);