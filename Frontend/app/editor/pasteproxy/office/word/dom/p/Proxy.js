/**
 * Прокси для узла p.
 *
 * @singleton
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.pasteproxy.office.word.dom.p.Proxy',
	{
		extend: 'FBEditor.editor.pasteproxy.dom.PProxy',
		
		statics: {
			/**
			 * Возвращает объект.
			 * @param data
			 * @return {FBEditor.editor.pasteproxy.office.word.dom.p.Proxy}
			 */
			getImplementation: function (data)
			{
				var me = this,
					self;
				
				self = me.self || Ext.create('FBEditor.editor.pasteproxy.office.word.dom.p.Proxy', data);
				self.node = data.node;
				self.domProxy = data.domProxy;
				me.self = self;
				
				return self;
			},
			
			/**
			 * @private
			 * @property {FBEditor.editor.pasteproxy.office.word.dom.p.Proxy}
			 */
			self: null
		},
		
		/**
		 * @property {Object} Карта преобразований к другим элементам, в зависимости от текущих CSS-стилей.
		 * Каждая запись содержит ключ CSS-свойства, его значение и название элемента.
		 */
		mapStyle: {
			'mso-list': {
				pattern: /l[0-1] level[0-9]+ lfo[1-2]/,
				el: 'li'
			}
		},
		
		clean: function ()
		{
			var me = this;
			
			me.cleanList();
		},
		
		/**
		 * @private
		 * Очищает лишний текст, который возникает при копировании списка.
		 */
		cleanList: function ()
		{
			var me = this,
				node = me.node,
				ignoreNode;
			
			ignoreNode = node.querySelector('span[style="mso-list:Ignore"]');
			
			if (ignoreNode)
			{
				ignoreNode.parentNode.removeChild(ignoreNode);
			}
		}
	}
);