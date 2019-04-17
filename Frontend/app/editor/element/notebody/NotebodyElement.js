/**
 * Элемент notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.notebody.NotebodyElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.notebody.CreateCommand',
			'FBEditor.editor.element.notebody.NotebodyElementController'
		],
		
		controllerClass: 'FBEditor.editor.element.notebody.NotebodyElementController',
		htmlTag: 'notebody',
		xmlTag: 'notebody',
		cls: 'el-notebody',
		splittable: true,

		isNotebody: true,

		createScaffold: function ()
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				els = {};

			els.p = factory.createElement('p');
			els.t = factory.createElementText('Текст сноски');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		},
		
		update: function (data, opts)
		{
			var me = this,
				manager = me.getManager();
			
			me.callParent(arguments);
			
			// обновляем коллекцию id сносок
			manager.updateNotesId();
		},
		
		/**
		 * Генерирует новый id.
		 */
		generateNoteId: function ()
		{
			var me = this,
				manager = me.getManager();
			
			// обновляем коллекцию id сносок
			manager.updateNotesId();
			
			// получаем новый id сноски
			me.attributes.id = manager.generateNoteId();
		}
	}
);