/**
 * Корневой элемент в описании книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.desc.AbstractRootElement',
	{
		extend: 'FBEditor.editor.element.root.RootElement',

		cls: 'el-desc-root',

		/**
		 * @property {Boolean} Является ли элементом описания книги.
		 */
		isDesc: true,

		getXml: function ()
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			// пустой ли элемент
			xml = me.isEmpty() ? xml.replace('<br/>', '') : xml;

			return xml;
		},

		createScaffold: function ()
		{
			var me = this,
				els = {},
				factory = FBEditor.editor.Factory;

			els.p = factory.createElement('p');
			els.br = factory.createElement('br');
			els.p.add(els.br);
			me.add(els.p);

			return els;
		}
	}
);