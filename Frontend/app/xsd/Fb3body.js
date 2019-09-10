/**
 * Схема XSD для тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.xsd.Fb3body',
	{
		/**
		 * Возвращает JSON.
		 * @return {Object}
		 */
		getJson: function ()
		{
			var json;
			
			json = {
				"fb3-body": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"section": {
									"name": "section",
									"maxOccurs": "unbounded"
								}
							}
						},
						{
							"element": {
								"notes": {
									"name": "notes",
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								}
							}
						},
						{
							"element": {
								"notebody": {
									"name": "notebody",
									"type": "fb3b:SemiSimpleBodyType",
									"maxOccurs": "unbounded"
								}
							}
						}
					],
					"choice": {}
				},
				"section": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"annotation": {
									"name": "annotation",
									"type": "fb3b:BasicAnnotationType",
									"minOccurs": "0"
								}
							}
						},
						{
							"choice": {
								"elements": [
									{
										"section": {
											"name": "section",
											"type": "fb3b:SectionType",
											"maxOccurs": "unbounded"
										}
									},
									{
										"clipped": {
											"name": "clipped"
										}
									}
								],
								"sequence": [
									{
										"choice": {
											"attributes": {
												"maxOccurs": "unbounded"
											},
											"elements": [
												{
													"p": {
														"name": "p",
														"type": "fb3b:StyleType"
													}
												},
												{
													"subtitle": {
														"name": "subtitle",
														"type": "fb3b:StyleType"
													}
												},
												{
													"ol": {
														"name": "ol"
													}
												},
												{
													"ul": {
														"name": "ul"
													}
												},
												{
													"pre": {
														"name": "pre",
														"type": "fb3b:PHolderType"
													}
												},
												{
													"table": {
														"name": "table"
													}
												},
												{
													"poem": {
														"name": "poem"
													}
												},
												{
													"blockquote": {
														"name": "blockquote",
														"type": "fb3b:PHolderType"
													}
												},
												{
													"br": {
														"name": "br",
														"type": "fb3b:BRType"
													}
												},
												{
													"div": {
														"name": "div",
														"type": "fb3b:DivBlockType"
													}
												}
											]
										}
									},
									{
										"element": {
											"subscription": {
												"name": "subscription",
												"type": "fb3b:SubscriptionType",
												"minOccurs": "0"
											}
										}
									}
								]
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "section",
						"maxOccurs": "unbounded",
						"output": {
							"name": "output",
							"type": {
								"base": "token",
								"pattern": null,
								"enumeration": [
									"default",
									"trial",
									"trial-only",
									"payed"
								]
							},
							"default": "default"
						},
						"id": {
							"name": "id",
							"type": {
								"base": "token",
								"pattern": "[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}"
							},
							"use": "required"
						},
						"article": {
							"name": "article",
							"type": "boolean",
							"use": "optional"
						},
						"doi": {
							"name": "doi",
							"type": {
								"base": "string",
								"pattern": "(10[.][0-9]{3,})(.[0-9]+)*/[^\"]([^\"&amp;&lt;&gt;])+"
							},
							"use": "optional"
						},
						"clipped": {
							"name": "clipped",
							"type": "boolean"
						},
						"first-char-pos": {
							"name": "first-char-pos",
							"type": "positiveInteger"
						}
					}
				},
				"notes": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"notebody": {
									"name": "notebody",
									"type": "fb3b:SemiSimpleBodyType",
									"maxOccurs": "unbounded"
								}
							}
						}
					],
					"choice": {}
				},
				"notebody": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"type": "fb3b:SimpleTextType",
									"minOccurs": "0"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol"
										}
									},
									{
										"ul": {
											"name": "ul"
										}
									},
									{
										"pre": {
											"name": "pre",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"table": {
											"name": "table",
											"type": "fb3b:TableType"
										}
									},
									{
										"poem": {
											"name": "poem",
											"type": "fb3b:PoemType"
										}
									},
									{
										"blockquote": {
											"name": "blockquote",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "notebody",
						"type": "fb3b:SemiSimpleBodyType",
						"maxOccurs": "unbounded",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"title": {
					"sequence": [
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "title",
						"minOccurs": "0",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"epigraph": {
					"sequence": [
						{
							"element": {
								"poem": {
									"name": "poem",
									"type": "fb3b:PoemType"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"element": {
								"poem": {
									"name": "poem",
									"type": "fb3b:PoemType"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"element": {
								"br": {
									"name": "br",
									"type": "fb3b:BRType"
								}
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					]
				},
				"poem": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"stanza": {
									"name": "stanza",
									"type": "fb3b:PHolderType",
									"maxOccurs": "unbounded"
								}
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "poem",
						"type": "fb3b:PoemType",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"p": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "p",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"br": {
					"sequence": [],
					"choice": {},
					"attributes": {
						"name": "br",
						"type": "fb3b:BRType",
						"clear": {
							"name": "clear",
							"type": {
								"base": "token",
								"pattern": null,
								"enumeration": [
									"left",
									"right",
									"both",
									"page"
								]
							},
							"use": "optional"
						},
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"subscription": {
					"sequence": [
						{
							"choice": {
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"pre": {
											"name": "pre",
											"type": "fb3b:ReducedPHolderType"
										}
									},
									{
										"blockquote": {
											"name": "blockquote",
											"type": "fb3b:ReducedPHolderType"
										}
									}
								]
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"pre": {
											"name": "pre",
											"type": "fb3b:ReducedPHolderType"
										}
									},
									{
										"blockquote": {
											"name": "blockquote",
											"type": "fb3b:ReducedPHolderType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "subscription",
						"type": "fb3b:SubscriptionType",
						"minOccurs": "0",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"annotation": {
					"sequence": [
						{
							"choice": {
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"pre": {
											"name": "pre",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"blockquote": {
											"name": "blockquote",
											"type": "fb3b:PHolderType"
										}
									}
								]
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"pre": {
											"name": "pre",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"blockquote": {
											"name": "blockquote",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "annotation",
						"type": "fb3b:BasicAnnotationType",
						"minOccurs": "0",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"subtitle": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "subtitle",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"ol": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"li": {
									"name": "li",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"li": {
											"name": "li",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									}
								]
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "ol",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"ul": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"li": {
									"name": "li",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"li": {
											"name": "li",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									}
								]
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "ul",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"pre": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {}
				},
				"table": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"tr": {
									"name": "tr",
									"maxOccurs": "unbounded"
								}
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "table",
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"blockquote": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {}
				},
				"div": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"type": "fb3b:SimpleTextType",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"marker": {
									"name": "marker",
									"minOccurs": "0"
								}
							}
						},
						{
							"choice": {
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"pre": {
											"name": "pre",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"table": {
											"name": "table",
											"type": "fb3b:TableType"
										}
									},
									{
										"poem": {
											"name": "poem",
											"type": "fb3b:PoemType"
										}
									},
									{
										"blockquote": {
											"name": "blockquote",
											"type": "fb3b:PHolderType"
										}
									}
								]
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"ol": {
											"name": "ol",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"ul": {
											"name": "ul",
											"type": "fb3b:LiHolderType"
										}
									},
									{
										"pre": {
											"name": "pre",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"table": {
											"name": "table",
											"type": "fb3b:TableType"
										}
									},
									{
										"poem": {
											"name": "poem",
											"type": "fb3b:PoemType"
										}
									},
									{
										"blockquote": {
											"name": "blockquote",
											"type": "fb3b:PHolderType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "div",
						"type": "fb3b:DivBlockType",
						"float": {
							"name": "float",
							"use": "optional",
							"type": {
								"base": "token",
								"enumeration": [
									"left",
									"right",
									"center",
									"default"
								]
							}
						},
						"align": {
							"name": "align",
							"type": {
								"base": "token",
								"pattern": null,
								"enumeration": [
									"left",
									"right",
									"center",
									"justify"
								]
							},
							"use": "optional"
						},
						"bindto": {
							"name": "bindto",
							"type": "IDREF",
							"use": "optional"
						},
						"border": {
							"name": "border",
							"type": "boolean",
							"use": "optional"
						},
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						},
						"on-one-page": {
							"name": "on-one-page",
							"type": "boolean",
							"use": "optional"
						},
						"width": {
							"name": "width",
							"type": {
								"base": "normalizedString",
								"pattern": "\\d+(.\\d+)?(em|ex|%|mm)"
							},
							"use": "optional"
						},
						"min-width": {
							"name": "min-width",
							"type": {
								"base": "normalizedString",
								"pattern": "\\d+(.\\d+)?(em|ex|%|mm)"
							},
							"use": "optional"
						},
						"max-width": {
							"name": "max-width",
							"type": {
								"base": "normalizedString",
								"pattern": "\\d+(.\\d+)?(em|ex|%|mm)"
							},
							"use": "optional"
						}
					}
				},
				"clipped": {
					"sequence": []
				},
				"marker": {
					"sequence": [
						{
							"element": {
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							}
						}
					]
				},
				"img": {
					"sequence": [],
					"choice": {},
					"attributes": {
						"name": "img",
						"type": "fb3b:ImgType",
						"src": {
							"name": "src",
							"type": "anyURI",
							"use": "required"
						},
						"alt": {
							"name": "alt",
							"type": "string",
							"use": "optional"
						},
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						},
						"width": {
							"name": "width",
							"type": {
								"base": "normalizedString",
								"pattern": "\\d+(.\\d+)?(em|ex|%|mm)"
							},
							"use": "optional"
						},
						"min-width": {
							"name": "min-width",
							"type": {
								"base": "normalizedString",
								"pattern": "\\d+(.\\d+)?(em|ex|%|mm)"
							},
							"use": "optional"
						},
						"max-width": {
							"name": "max-width",
							"type": {
								"base": "normalizedString",
								"pattern": "\\d+(.\\d+)?(em|ex|%|mm)"
							},
							"use": "optional"
						}
					}
				},
				"tr": {
					"sequence": [
						{
							"element": {
								"th": {
									"name": "th",
									"type": "fb3b:TDType"
								}
							}
						},
						{
							"element": {
								"td": {
									"name": "td",
									"type": "fb3b:TDType"
								}
							}
						}
					]
				},
				"th": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "th",
						"type": "fb3b:TDType",
						"colspan": {
							"name": "colspan",
							"type": "integer",
							"use": "optional"
						},
						"rowspan": {
							"name": "rowspan",
							"type": "integer",
							"use": "optional"
						},
						"align": {
							"name": "align",
							"type": {
								"base": "token",
								"pattern": null,
								"enumeration": [
									"left",
									"right",
									"center",
									"justify"
								]
							},
							"use": "optional",
							"default": "left"
						},
						"valign": {
							"name": "valign",
							"type": {
								"base": "token",
								"pattern": null,
								"enumeration": [
									"top",
									"middle",
									"bottom"
								]
							},
							"use": "optional",
							"default": "top"
						}
					}
				},
				"td": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {},
					"attributes": {
						"name": "td",
						"type": "fb3b:TDType",
						"colspan": {
							"name": "colspan",
							"type": "integer",
							"use": "optional"
						},
						"rowspan": {
							"name": "rowspan",
							"type": "integer",
							"use": "optional"
						},
						"align": {
							"name": "align",
							"type": {
								"base": "token",
								"pattern": null,
								"enumeration": [
									"left",
									"right",
									"center",
									"justify"
								]
							},
							"use": "optional",
							"default": "left"
						},
						"valign": {
							"name": "valign",
							"type": {
								"base": "token",
								"pattern": null,
								"enumeration": [
									"top",
									"middle",
									"bottom"
								]
							},
							"use": "optional",
							"default": "top"
						}
					}
				},
				"strong": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "strong",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"em": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "em",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"strikethrough": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "strikethrough",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"sub": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "sub",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"sup": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "sup",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"code": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "code",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"underline": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "underline",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"spacing": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "spacing",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"span": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "span",
						"class": {
							"name": "class",
							"type": "normalizedString",
							"use": "optional"
						},
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"note": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "note",
						"type": "fb3b:NoteType",
						"mixed": true,
						"href": {
							"name": "href",
							"type": "IDREF",
							"use": "required"
						},
						"role": {
							"name": "role",
							"use": "optional",
							"default": "auto",
							"type": {
								"base": "token",
								"enumeration": [
									"auto",
									"footnote",
									"endnote",
									"comment",
									"other"
								]
							}
						},
						"autotext": {
							"name": "autotext",
							"default": "1",
							"use": "optional",
							"type": {
								"base": "token",
								"enumeration": [
									"1",
									"i",
									"a",
									"*",
									"keep"
								]
							}
						},
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"a": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleInLinkType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "a",
						"type": "fb3b:LinkType",
						"mixed": true,
						"href": {
							"name": "href",
							"type": "anyURI",
							"use": "required"
						},
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"smallcaps": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "smallcaps",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"paper-page-break": {
					"sequence": [],
					"choice": {},
					"attributes": {
						"name": "paper-page-break",
						"type": "fb3b:PaperPageBreakType",
						"page-before": {
							"name": "page-before",
							"type": "positiveInteger",
							"use": "required"
						},
						"page-after": {
							"name": "page-after",
							"type": "positiveInteger",
							"use": "optional"
						}
					}
				},
				"li": {
					"sequence": [],
					"choice": {
						"attributes": {
							"minOccurs": "0",
							"maxOccurs": "unbounded"
						},
						"elements": [
							{
								"strong": {
									"name": "strong",
									"type": "fb3b:StyleType"
								}
							},
							{
								"em": {
									"name": "em",
									"type": "fb3b:StyleType"
								}
							},
							{
								"strikethrough": {
									"name": "strikethrough",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sub": {
									"name": "sub",
									"type": "fb3b:StyleType"
								}
							},
							{
								"sup": {
									"name": "sup",
									"type": "fb3b:StyleType"
								}
							},
							{
								"code": {
									"name": "code",
									"type": "fb3b:StyleType"
								}
							},
							{
								"underline": {
									"name": "underline",
									"type": "fb3b:StyleType"
								}
							},
							{
								"spacing": {
									"name": "spacing",
									"type": "fb3b:StyleType"
								}
							},
							{
								"span": {
									"name": "span"
								}
							},
							{
								"note": {
									"name": "note",
									"type": "fb3b:NoteType"
								}
							},
							{
								"a": {
									"name": "a",
									"type": "fb3b:LinkType"
								}
							},
							{
								"smallcaps": {
									"name": "smallcaps",
									"type": "fb3b:StyleType"
								}
							},
							{
								"img": {
									"name": "img",
									"type": "fb3b:ImgType"
								}
							},
							{
								"paper-page-break": {
									"name": "paper-page-break",
									"type": "fb3b:PaperPageBreakType"
								}
							}
						]
					},
					"attributes": {
						"name": "li",
						"type": "fb3b:StyleType",
						"mixed": true,
						"id": {
							"name": "id",
							"type": "ID",
							"use": "optional"
						}
					}
				},
				"stanza": {
					"sequence": [
						{
							"element": {
								"title": {
									"name": "title",
									"minOccurs": "0"
								}
							}
						},
						{
							"element": {
								"epigraph": {
									"name": "epigraph",
									"minOccurs": "0",
									"maxOccurs": "25"
								}
							}
						},
						{
							"element": {
								"p": {
									"name": "p",
									"type": "fb3b:StyleType"
								}
							}
						},
						{
							"choice": {
								"attributes": {
									"minOccurs": "0",
									"maxOccurs": "unbounded"
								},
								"elements": [
									{
										"p": {
											"name": "p",
											"type": "fb3b:StyleType"
										}
									},
									{
										"br": {
											"name": "br",
											"type": "fb3b:BRType"
										}
									}
								]
							}
						},
						{
							"element": {
								"subscription": {
									"name": "subscription",
									"type": "fb3b:SubscriptionType",
									"minOccurs": "0"
								}
							}
						}
					],
					"choice": {}
				}
			};
			
			return json;
		},
		
		/**
		 * Вовзращает xsd.
		 * @return {String} Строка xsd.
		 */
		getXsd: function ()
		{
			var xsd;
			
			xsd = '<?xml version="1.0" encoding="UTF-8"?>\
<schema xmlns:fb3b="http://www.fictionbook.org/FictionBook3/body" xmlns="http://www.w3.org/2001/XMLSchema"\
		xmlns:xlink="http://www.w3.org/1999/xlink" targetNamespace="http://www.fictionbook.org/FictionBook3/body"\
		elementFormDefault="qualified" attributeFormDefault="unqualified">\
	<element name="fb3-body">\
		<complexType>\
			<complexContent>\
				<extension base="fb3b:TitledType">\
					<sequence>\
						<element name="section" maxOccurs="unbounded">\
							<complexType>\
								<complexContent>\
									<extension base="fb3b:SectionType">\
										<attribute name="output" type="fb3b:TrialShareType" default="default"/>\
									</extension>\
								</complexContent>\
							</complexType>\
						</element>\
						<element name="notes" minOccurs="0" maxOccurs="unbounded">\
							<complexType>\
								<complexContent>\
									<extension base="fb3b:TitledType">\
										<sequence>\
											<element name="notebody" type="fb3b:SemiSimpleBodyType"\
											 maxOccurs="unbounded"/>\
										</sequence>\
										<attribute name="show"/>\
									</extension>\
								</complexContent>\
							</complexType>\
						</element>\
					</sequence>\
					<attribute name="id" type="fb3b:UUIDType" use="required"/>\
				</extension>\
			</complexContent>\
		</complexType>\
		<unique name="SectionID">\
			<selector xpath=".//section"/>\
			<field xpath="@id"/>\
		</unique>\
		<key name="SimpleNotesLinks">\
			<selector xpath=".//note"/>\
			<field xpath="@fb3b:href"/>\
		</key>\
		<keyref name="SimpleNotesTargets" refer="fb3b:SimpleNotesLinks">\
			<selector xpath="notes/note"/>\
			<field xpath="@id"/>\
		</keyref>\
	</element>\
	<complexType name="TitledType">\
		<sequence>\
			<element name="title" minOccurs="0">\
				<complexType>\
					<complexContent>\
						<extension base="fb3b:SimpleTextType"/>\
					</complexContent>\
				</complexType>\
			</element>\
			<element name="epigraph" minOccurs="0" maxOccurs="25">\
				<complexType>\
					<sequence>\
					    <choice>\
					        <element name="poem" type="fb3b:PoemType"/>\
				            <element name="p" type="fb3b:StyleType"/>\
				        </choice>\
				        <choice minOccurs="0" maxOccurs="unbounded">\
			                <element name="poem" type="fb3b:PoemType"/>\
			                <element name="p" type="fb3b:StyleType"/>\
			                <element name="br" type="fb3b:BRType"/>\
			            </choice>\
			            <element name="subscription" type="fb3b:SubscriptionType" minOccurs="0"/>\
			        </sequence>\
				</complexType>\
			</element>\
		</sequence>\
	</complexType>\
	<complexType name="SimpleTextType">\
		<sequence>\
			<element name="p" type="fb3b:StyleType"/>\
			<choice minOccurs="0" maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
			<element name="subscription" type="fb3b:SubscriptionType" minOccurs="0"/>\
		</sequence>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="SectionType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="annotation" type="fb3b:BasicAnnotationType" minOccurs="0"/>\
					<choice>\
						<element name="section" type="fb3b:SectionType" maxOccurs="unbounded"></element>\
						<sequence>\
							<choice maxOccurs="unbounded">\
								<element name="p" type="fb3b:StyleType"/>\
								<element name="subtitle" type="fb3b:StyleType"></element>\
								<element name="ol">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:LiHolderType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="ul">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:LiHolderType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="pre" type="fb3b:PHolderType"/>\
								<element name="table">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:TableType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="poem">\
									<complexType>\
										<complexContent>\
											<extension base="fb3b:PoemType"/>\
										</complexContent>\
									</complexType>\
								</element>\
								<element name="blockquote" type="fb3b:PHolderType"/>\
								<element name="br" type="fb3b:BRType"/>\
								<element name="div" type="fb3b:DivBlockType"></element>\
							</choice>\
							<element name="subscription" type="fb3b:SubscriptionType" minOccurs="0"/>\
						</sequence>\
						<element name="clipped"><complexType/></element>\
					</choice>\
				</sequence>\
				<attribute name="id" type="fb3b:UUIDType" use="required"/>\
				<attribute name="article" type="boolean" use="optional"/>\
				<attribute name="doi" type="fb3b:DOIType" use="optional"/>\
				<attribute name="clipped" type="boolean"/>\
				<attribute name="first-char-pos" type="positiveInteger"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="DivBlockType">\
		<sequence>\
			<element name="title" type="fb3b:SimpleTextType" minOccurs="0"/>\
			<element name="marker" minOccurs="0">\
				<complexType>\
					<sequence>\
						<element name="img" type="fb3b:ImgType"/>\
					</sequence>\
				</complexType>\
			</element>\
			<choice>\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="table" type="fb3b:TableType"/>\
				<element name="poem" type="fb3b:PoemType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
			</choice>\
			<choice minOccurs="0" maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="table" type="fb3b:TableType"/>\
				<element name="poem" type="fb3b:PoemType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
			<element name="subscription" type="fb3b:SubscriptionType" minOccurs="0"/>\
		</sequence>\
		<attributeGroup ref="fb3b:SizingAttributes"/>\
		<attribute name="float" use="optional">\
			<simpleType>\
				<restriction base="token">\
					<enumeration value="left"/>\
					<enumeration value="right"/>\
					<enumeration value="center"/>\
					<enumeration value="default"/>\
				</restriction>\
			</simpleType>\
		</attribute>\
		<attribute name="align" type="fb3b:alignType" use="optional"/>\
		<attribute name="bindto" type="IDREF" use="optional"/>\
		<attribute name="border" type="boolean" use="optional"/>\
		<attribute name="id" type="ID" use="optional"/>\
		<attribute name="on-one-page" type="boolean" use="optional"/>\
	</complexType>\
	<complexType name="BasicAnnotationType">\
		<sequence>\
			<choice>\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
			</choice>\
			<choice minOccurs="0" maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
		</sequence>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="SubscriptionType">\
		<sequence>\
			<choice>\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:ReducedPHolderType"/>\
				<element name="blockquote" type="fb3b:ReducedPHolderType"/>\
			</choice>\
			<choice minOccurs="0" maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol" type="fb3b:LiHolderType"/>\
				<element name="ul" type="fb3b:LiHolderType"/>\
				<element name="pre" type="fb3b:ReducedPHolderType"/>\
				<element name="blockquote" type="fb3b:ReducedPHolderType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
		</sequence>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="BRType">\
		<attribute name="clear" type="fb3b:BrClearType" use="optional"/>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="TableType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="tr" maxOccurs="unbounded">\
						<complexType>\
							<choice maxOccurs="unbounded">\
								<element name="th" type="fb3b:TDType"/>\
								<element name="td" type="fb3b:TDType"/>\
							</choice>\
							<attribute name="align" type="fb3b:alignType" use="optional" default="left"/>\
							<attribute name="id" type="ID" use="optional"/>\
						</complexType>\
					</element>\
				</sequence>\
				<attribute name="id" type="ID" use="optional"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="TDType">\
		<complexContent>\
			<extension base="fb3b:PHolderType">\
				<attribute name="colspan" type="integer" use="optional"/>\
				<attribute name="rowspan" type="integer" use="optional"/>\
				<attribute name="align" type="fb3b:alignType" use="optional" default="left"/>\
				<attribute name="valign" type="fb3b:vAlignType" use="optional" default="top"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="StyleType" mixed="true">\
		<choice minOccurs="0" maxOccurs="unbounded">\
			<element name="strong" type="fb3b:StyleType"></element>\
			<element name="em" type="fb3b:StyleType"></element>\
			<element name="strikethrough" type="fb3b:StyleType"></element>\
			<element name="sub" type="fb3b:StyleType"></element>\
			<element name="sup" type="fb3b:StyleType"></element>\
			<element name="code" type="fb3b:StyleType"></element>\
			<element name="underline" type="fb3b:StyleType"></element>\
			<element name="spacing" type="fb3b:StyleType"></element>\
			<element name="span">\
				<complexType mixed="true">\
					<complexContent mixed="true">\
						<extension base="fb3b:StyleType">\
							<attribute name="class" type="normalizedString" use="optional"/>\
						</extension>\
					</complexContent>\
				</complexType>\
			</element>\
			<element name="note" type="fb3b:NoteType"/>\
			<element name="a" type="fb3b:LinkType"/>\
			<element name="smallcaps" type="fb3b:StyleType"/>\
			<element name="img" type="fb3b:ImgType"/>\
			<element name="paper-page-break" type="fb3b:PaperPageBreakType"/>\
		</choice>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="StyleInLinkType" mixed="true">\
		<choice minOccurs="0" maxOccurs="unbounded">\
			<element name="strong" type="fb3b:StyleInLinkType"/>\
			<element name="em" type="fb3b:StyleInLinkType"/>\
			<element name="strikethrough" type="fb3b:StyleInLinkType"/>\
			<element name="sub" type="fb3b:StyleInLinkType"/>\
			<element name="sup" type="fb3b:StyleInLinkType"/>\
			<element name="code" type="fb3b:StyleInLinkType"/>\
			<element name="underline" type="fb3b:StyleInLinkType"/>\
			<element name="spacing" type="fb3b:StyleInLinkType"/>\
			<element name="span">\
				<complexType mixed="true">\
					<complexContent mixed="true">\
						<extension base="fb3b:StyleInLinkType">\
							<attribute name="class" type="normalizedString" use="optional"/>\
						</extension>\
					</complexContent>\
				</complexType>\
			</element>\
			<element name="smallcaps" type="fb3b:StyleType"/>\
			<element name="img" type="fb3b:ImgType"/>\
			<element name="paper-page-break" type="fb3b:PaperPageBreakType"/>\
		</choice>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="LinkType" mixed="true">\
		<complexContent mixed="true">\
			<extension base="fb3b:StyleInLinkType">\
				<attribute name="href" type="anyURI" use="required"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="NoteType" mixed="true">\
		<complexContent mixed="true">\
			<extension base="fb3b:StyleInLinkType">\
				<attribute name="href" type="IDREF" use="required"/>\
				<attribute name="role" use="optional" default="auto">\
					<simpleType>\
						<restriction base="token">\
							<enumeration value="auto"/>\
							<enumeration value="footnote"/>\
							<enumeration value="endnote"/>\
							<enumeration value="comment"/>\
							<enumeration value="other"/>\
						</restriction>\
					</simpleType>\
				</attribute>\
				<attribute name="autotext" default="1" use="optional">\
					<simpleType>\
						<restriction base="token">\
							<enumeration value="1"/>\
							<enumeration value="i"/>\
							<enumeration value="a"/>\
							<enumeration value="*"/>\
							<enumeration value="keep"/>\
						</restriction>\
					</simpleType>\
            	</attribute>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="ImgType">\
		<attribute name="src" type="anyURI" use="required"/>\
		<attribute name="alt" type="string" use="optional"/>\
		<attribute name="id" type="ID" use="optional"/>\
		<attributeGroup ref="fb3b:SizingAttributes"/>\
	</complexType>\
	<complexType name="PHolderType">\
		<complexContent>\
			<extension base="fb3b:ReducedPHolderType">\
				<sequence>\
					<element name="subscription" type="fb3b:SubscriptionType" minOccurs="0"/>\
				</sequence>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="ReducedPHolderType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
				<element name="p" type="fb3b:StyleType"/>\
				<choice minOccurs="0" maxOccurs="unbounded">\
					<element name="p" type="fb3b:StyleType"/>\
					<element name="br" type="fb3b:BRType"/>\
				</choice>\
				</sequence>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="LiHolderType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="li" type="fb3b:StyleType"/>\
					<choice minOccurs="0" maxOccurs="unbounded">\
						<element name="li" type="fb3b:StyleType"/>\
						<element name="ol" type="fb3b:LiHolderType"/>\
						<element name="ul" type="fb3b:LiHolderType"/>\
					</choice>\
				</sequence>\
				<attribute name="id" type="ID" use="optional"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="PoemType">\
		<complexContent>\
			<extension base="fb3b:TitledType">\
				<sequence>\
					<element name="stanza" type="fb3b:PHolderType" maxOccurs="unbounded"/>\
					<element name="subscription" type="fb3b:SubscriptionType" minOccurs="0"/>\
				</sequence>\
				<attribute name="id" type="ID" use="optional"/>\
			</extension>\
		</complexContent>\
	</complexType>\
	<complexType name="SemiSimpleBodyType">\
		<sequence>\
			<element name="title" type="fb3b:SimpleTextType" minOccurs="0"/>\
			<choice maxOccurs="unbounded">\
				<element name="p" type="fb3b:StyleType"/>\
				<element name="ol">\
					<complexType>\
						<complexContent>\
							<extension base="fb3b:LiHolderType"/>\
						</complexContent>\
					</complexType>\
				</element>\
				<element name="ul">\
					<complexType>\
						<complexContent>\
							<extension base="fb3b:LiHolderType"/>\
						</complexContent>\
					</complexType>\
				</element>\
				<element name="pre" type="fb3b:PHolderType"/>\
				<element name="table" type="fb3b:TableType"/>\
				<element name="poem" type="fb3b:PoemType"/>\
				<element name="blockquote" type="fb3b:PHolderType"/>\
				<element name="br" type="fb3b:BRType"/>\
			</choice>\
		</sequence>\
		<attribute name="id" type="ID" use="optional"/>\
	</complexType>\
	<complexType name="PaperPageBreakType">\
		<attribute name="page-before" type="positiveInteger" use="required"/>\
		<attribute name="page-after" type="positiveInteger" use="optional"/>\
	</complexType>\
	<simpleType name="alignType">\
		<restriction base="token">\
			<enumeration value="left"/>\
			<enumeration value="right"/>\
			<enumeration value="center"/>\
			<enumeration value="justify"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="vAlignType">\
		<restriction base="token">\
			<enumeration value="top"/>\
			<enumeration value="middle"/>\
			<enumeration value="bottom"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="BrClearType">\
		<restriction base="token">\
			<enumeration value="left"/>\
			<enumeration value="right"/>\
			<enumeration value="both"/>\
			<enumeration value="page"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="TrialShareType">\
		<restriction base="token">\
			<enumeration value="default"/>\
			<enumeration value="trial"/>\
			<enumeration value="trial-only"/>\
			<enumeration value="payed"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="ScreenSizeType">\
		<restriction base="normalizedString">\
			<pattern value="\\\d+(\\.\\\d+)?(em|ex|%|mm)"/>\
		</restriction>\
	</simpleType>\
	<attributeGroup name="SizingAttributes">\
		<attribute name="width" type="fb3b:ScreenSizeType" use="optional"/>\
		<attribute name="min-width" type="fb3b:ScreenSizeType" use="optional"/>\
		<attribute name="max-width" type="fb3b:ScreenSizeType" use="optional"/>\
	</attributeGroup>\
	<simpleType name="UUIDType">\
		<restriction base="token">\
			<pattern value="[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}"/>\
		</restriction>\
	</simpleType>\
	<simpleType name="DOIType">\
        <restriction base="string">\
            <pattern value=\'(10[.][0-9]{3,})(\\.[0-9]+)*/[^"]([^"&amp;&lt;&gt;])+\'/>\
		</restriction>\
	</simpleType>\
	<attribute name="role" default="auto">\
		<simpleType>\
			<restriction base="token">\
				<enumeration value="auto"/>\
				<enumeration value="footnote"/>\
				<enumeration value="endnote"/>\
				<enumeration value="comment"/>\
				<enumeration value="other"/>\
			</restriction>\
		</simpleType>\
	</attribute>\
	<attribute name="href" type="anyURI"></attribute>\
</schema>';
			
			return xsd;
		}
	}
);