/**
 * Панель для отображения данных произведений.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.arts.Arts',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.arts.ArtsController',
			'FBEditor.view.panel.arts.ArtsStore'
		],
		controller: 'panel.arts',
		xtype: 'panel-arts',
		cls: 'panel-arts',
		minWidth: 300,

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {Function} Вызывается при выборе произведения из списка.
		 * @param {Object} Данные произведения.
		 */
		selectFn: Ext.emptyFn,

		translateText: {
			notFound: 'Ничего не найдено',
			loading: 'Загрузка...'
		},

		initComponent: function ()
		{
			var me = this,
				store;

			// хранилище
			store = Ext.create('FBEditor.view.panel.arts.ArtsStore');
			store.setCallback(
				{
					fn: me.load,
					scope: me
				}
			);
			me.store = store;

			me.callParent(arguments);
		},

		/**
		 * Загружает данные произведений в панель.
		 * @param {Array} data Данные произведений.
		 */
		load: function (data)
		{
			var me = this;

			//console.log('load', data);
			me.setLoading(false);
			//me.clean();

			if (data && data.length)
			{
				Ext.Array.each(
					data,
					function (item)
					{
						var art,
							artItems;

						if (item)
						{
							artItems = [
								{
									xtype: 'component',
									html: me.getHtmlArt(item),
									afterRender: function ()
									{
										me.afterRenderArt(this);
									}
								}
							];

							art = {
								xtype: 'container',
								width: '100%',
								cls: 'panel-arts-item',
								items: artItems
							};

							me.add(art);
						}
					}
				);
			}
			else
			{
				me.noArts();
			}

			me.doLayout();
		},

		/**
		 * Удаляет все данные произведений.
		 */
		clean: function ()
		{
			var me = this;

			Ext.suspendLayouts();
			me.removeAll();
			Ext.resumeLayouts();
			me.doLayout();
		},

		/**
		 * Прерывает поиск.
		 */
		abort: function ()
		{
			var me = this,
				store = me.store;

			me.setLoading(false);
			store.abort();
		},

		/**
		 * Вызывается после добавления произведения в контейнер.
		 */
		afterRenderArt: function (artCmp)
		{
			var me = this,
				name;

			// добалвяем обработчик события при клике по названию
			name = artCmp.getEl().query('.panel-arts-item-name')[0];
			name.addEventListener(
				'click',
				function ()
				{
					var record,
						artId;

					artId = this.getAttribute('art-id');
					record = me.store.getRecord('id', artId);
					me.selectFn(record);
				}
			);
		},

		/**
		 * @private
		 * Выводит сообщение о том, что ничего не найдено.
		 */
		noArts: function ()
		{
			var me = this;

			me.clean();
			me.add(
				{
					border: true,
					layout: 'fit',
					style: 'text-align: center',
					html: me.translateText.notFound
				}
			);
		},

		/**
		 * @private
		 * Возвращает html для отображения данных произведения.
		 * @param {Object} data Данные произведения.
		 * @return {String} Строка html.
		 */
		getHtmlArt: function (data)
		{
			var me = this,
				name = me.store.params,
				tpl,
				html;

			tpl = new Ext.XTemplate(
				'<div class="panel-arts-item-common " style="background-color: {bgcolor}">' +
				'   <div class="panel-arts-item-name" art-id="{id}">' +
				'       <a style="color: {link_color}" target="_blank" ' +
				'           href="https://hub.litres.ru/pages/edit_object/?art={id}">{name}</a>' +
				'   </div>' +
				'</div>'
			);

			data.name = data.name ? data.name.replace(new RegExp('^(' + name + ')', 'i'), '<b>$1</b>') : '';
			data.name = data.name.trim();
			data.bgcolor = 'white';
			data.link_color = '#2e7ed5';

			html = tpl.apply(data);

			return html;
		}
	}
);