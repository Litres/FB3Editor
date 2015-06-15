/**
 * Текстовый элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.text.TextElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.text.TextElementController'
		],
		controllerClass: 'FBEditor.editor.element.text.TextElementController',

		showedOnTree: false,

		/**
		 * @property {String} Текст.
		 */
		text: '',

		/**
		 * @property {Boolean} Текстовый ли элемент.
		 */
		isText: true,

		/**
		 * @param {String} text Текст.
		 */
		constructor: function (text)
		{
			var me = this;

			me.elementId = Ext.id({prefix: me.prefixId});
			me.mixins.observable.constructor.call(me, {});
			me.text = Ext.isString(text) ? text : me.text;
			me.permit = me.permit ? Ext.applyIf(me.permit, me.permitDefault) : me.permitDefault;
			me.createController();
		},

		getNode: function (viewportId)
		{
			var me = this,
				node;

			node = me.createNode(viewportId);

			return node;
		},

		getXml: function ()
		{
			return this.text;
		},

		/*sync: function (viewportId)
		{
			var me = this,
				text;

			FBEditor.editor.Manager.suspendEvent = true;
			text = me.nodes[viewportId].nodeValue;
			console.log('sync ' + viewportId, me.nodes, text);
			Ext.Object.each(
				me.nodes,
				function (id, node)
				{
					if (id !== viewportId)
					{
						console.log('sync node', node);
						node.nodeValue = text;
					}
				}
			);
			FBEditor.editor.Manager.suspendEvent = false;
		},*/

		/**
		 * Устанавливает текст элемента.
		 * @param {String} text Текст.
		 */
		setText: function (text)
		{
			var me = this;

			me.text = text;
		},

		/**
		 * Создает текстовый узел.
		 * @return {HTMLElement} Возвращает текстовый узел.
		 */
		createNode: function (viewportId)
		{
			var me = this,
				node;

			node = document.createTextNode(me.text);
			node.viewportId = viewportId;
			me.setNode(node);

			return node;
		}
	}
);