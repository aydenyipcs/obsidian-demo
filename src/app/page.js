"use client";

import { useEffect, useState } from "react";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function highlightText(text, query) {
  if (!query) return text;

  const escapedQuery = escapeRegExp(query);
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="text-green-500">
        {part}
      </span>
    ) : (
      part
    )
  );
}

const PluginCard = ({ plugin, query }) => {
  const highlight = (text) => highlightText(text, query);
  return (
    <div className="p-5 flex flex-col bg-secondary rounded-lg transition-all hover:shadow-2xl hover:bg-opacity-80">
      <div className="text-lg mb-1 font-semibold leading-tight">
        {highlight(plugin.name)}
      </div>
      <p className="text-muted text-sm">{`By ${highlight(plugin.author)}`}</p>
      <p className="text-muted text-sm">{`${plugin.downloads} downloads`}</p>
      <div className="py-3 leading-tight">{highlight(plugin.description)}</div>
      <div className="text-center mt-auto">
        <div className="flex-1 flex gap-4 mt-3">
          <a className="block button py-1.5 text-sm shadow hover:bg-opacity-80">
            Install
          </a>
          <a
            className="ml-auto block text-muted font-medium py-1.5 text-sm hover:text-purple-400 hover:cursor-pointer"
            href={`https://github.com/${plugin.repo}`}
            target="_blank"
          >
            Learn more
          </a>
          <a className="flex text-muted font-medium py-1.5 text-sm transition-all duration-300 hover:text-purple-400 hover:cursor-pointer">
            Copy link
          </a>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plugins, setPlugins] = useState([]);
  const [validPlugins, setValidPlugins] = useState([]);

  useEffect(() => {
    const getPlugins = async () => {
      try {
        const response = await fetch("/api/getPlugins");
        if (!response.ok)
          throw new Error(`Error fetching data: ${response.statusText}`);
        const data = await response.json();
        setPlugins(data);
        setValidPlugins(plugins.map(plugin => plugin.id))
      } catch (error) {
        console.error("Error getting plugins:", error);
      }
    };
    getPlugins();
  }, []);

  const searchPlugins = async (query) => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }


      const data = await response.json();
      const pluginIds = data.map((plugin) => plugin.metadata[0].tracking_id);
      setValidPlugins(pluginIds);
    } catch (error) {
      console.error("Error searching plugins:", error);
    }
  };

  useEffect(() => {
    if (searchQuery !== "") {
      searchPlugins(searchQuery);
    } else {
      setValidPlugins(plugins.map(plugin => plugin.id))
    }
  }, [searchQuery,plugins]);


  const filteredPlugins = plugins.filter((plugin) =>
    validPlugins.includes(plugin.id)
  );

  return (
    <main className="">
      <div className="container">
        <div className="mt-12 mb-6">
          <h1 className="text-title mb-6">Plugins</h1>
          <div className="mb-4 text-2xl">
            Explore <span className="plugin-count">1,671 plugins</span> Obsidian
            plugins made by the community.
          </div>
          <div className="py-6">
            <a
              href="https://docs.obsidian.md"
              target="_blank"
              className="button button-primary mr-2"
            >
              API Docs
            </a>
            <a href="/community" className="button button-primary">
              Join the community
            </a>
          </div>
          <p>
            <input
              type="text"
              placeholder="Search plugins..."
              className="plugin-search text-xl w-full rounded-3xl max-w-2xl px-6 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </p>
        </div>
      </div>
      <div className="plugins-container container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(filteredPlugins) &&
          filteredPlugins.map((plugin) => {
            return (
              <PluginCard key={plugin.id} plugin={plugin} query={searchQuery} />
            );
          })}
      </div>
    </main>
  );
}
