/**
 * Элемент note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.note.NoteElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'note',
		xmlTag: 'note',
		cls: 'el-note',

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Текст');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);