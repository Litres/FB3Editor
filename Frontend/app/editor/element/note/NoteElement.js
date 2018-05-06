/**
 * Элемент note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.note.NoteElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.note.NoteElementController',
			'FBEditor.editor.command.note.CreateRangeCommand',
			'FBEditor.editor.command.note.DeleteWrapperCommand'
		],
		controllerClass: 'FBEditor.editor.element.note.NoteElementController',
		htmlTag: 'note',
		xmlTag: 'note',
		cls: 'el-note',
		showedOnTree: false,
		defaultAttributes: {
			href: 'undefined'
		},

		getAttributesXml: function (withoutText)
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
                    if (key === 'href' && withoutText)
                    {
                        // xmllint не может корректно проверить ссылки с &
                        val = val.replace(/&/g, '');
                    }

					//attr += (key === 'href' && !withoutText ? 'l:' : '') + key + '="' + val + '" ';
					attr += (key === 'role' && !withoutText ? 'xlink:' : '') + key + '="' + val + '" ';
				}
			);

			attr = attr.trim();

			return attr;
		},

		getBlock: function ()
		{
			return this;
		}
	}
);