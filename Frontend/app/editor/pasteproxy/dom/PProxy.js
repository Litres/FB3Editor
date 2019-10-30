/**
 * Прокси для узла p.
 *
 * @singleton
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.dom.PProxy',
	{
		extend: 'FBEditor.editor.pasteproxy.dom.AbstractProxy',
		
		statics: {
			/**
			 * Возвращает объект.
			 * @param data
			 * @return {FBEditor.editor.pasteproxy.dom.PProxy}
			 */
			getImplementation: function (data)
			{
				var me = this,
					self;
				
				self = me.self || Ext.create('FBEditor.editor.pasteproxy.dom.PProxy', data);
				self.node = data.node;
				self.domProxy = data.domProxy;
				me.self = self;
				
				return self;
			},
			
			/**
			 * @private
			 * @property {FBEditor.editor.pasteproxy.dom.PProxy}
			 */
			self: null
		},
		
		/**
		 * @property {Object} Карта преобразований к другим элементам, в зависимости от текущих CSS-стилей.
		 * Каждая запись содержит ключ CSS-свойства, его значение и название элемента.
		 */
		mapStyle: {},
		
		getNewName: function ()
		{
			var me = this,
				name;
			
			name = me.callParent(arguments);
			name = name || 'p';
			me.setName(name);
			
			return name;
		}
	}
);