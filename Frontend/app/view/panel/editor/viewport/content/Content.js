/**
 * Элемент, позволяющий редактирование своей внутренней структуры html.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.viewport.content.Content',
	{
		extend: 'Ext.Component',
		xtype: 'panel-editor-viewport-content',
		autoEl: 'div',
		width: '100%',
		height: '100%',
		autoScroll: true,
		cls: 'panel-editor-viewport-content',

		/**
		 * @private
		 * @property {String} Содержимое элемента до изменений.
		 */
		oldContent: null,

		afterRender: function ()
		{
			var me = this;

			me.oldContent = me.getEl().dom.innerHTML;

			// привязываем события input и change к элементу
			me.getEl().on(
				{
					input: function (evt, html)
					{
						var content = this.getEl().dom.innerHTML;

						this.fireEvent('input', this, this.oldContent, content);
						if (content !== this.oldContent)
						{
							this.fireEvent('change', this, this.oldContent, content);
							this.oldContent = content;
						}
					},
					scope: me
				}

			);
			me.callParent(arguments);
		},

		getElConfig: function()
		{
			var me = this,
				config = me.callParent();

			config.contentEditable = true;

			return config;
		}
	}
);