/**
 * Элемент note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.note.NoteElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.note.CreateCommand',
			'FBEditor.editor.element.note.NoteElementController'
		],
		controllerClass: 'FBEditor.editor.element.note.NoteElementController',
		htmlTag: 'note',
		xmlTag: 'note',
		cls: 'el-note',
		permit: {
			splittable: true
		},

		isNote: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Сноска');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);