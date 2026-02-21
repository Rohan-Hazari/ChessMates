"use client";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Community, Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from "cmdk";
import debounce from "lodash.debounce";
import { Search, Users, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Command } from "./ui/Command";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);

  const {
    data: queryResults = [],
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Community & {
        _count: Prisma.CommunityCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const request = debounce(() => {
    refetch();
  }, 500);

  const debounceRequest = useCallback(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-xl border border-slate-200 max-w-lg z-50 overflow-visible bg-white shadow-sm"
    >
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          onChange={(e) => {
            setInput(e.target.value);
            debounceRequest();
          }}
          value={input}
          className="w-full rounded-xl bg-transparent py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-shadow"
          placeholder="Search communities..."
        />
        {isFetching && (
          <Loader2 className="absolute right-3 h-4 w-4 text-amber-500 animate-spin" />
        )}
      </div>

      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 mt-1 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 max-h-64 overflow-y-auto">
          {isFetched && queryResults.length === 0 && (
            <CommandEmpty className="py-8 text-center text-sm text-slate-500">
              No communities found.
            </CommandEmpty>
          )}
          {queryResults && queryResults.length > 0 ? (
            <CommandGroup className="p-2" heading="">
              {queryResults?.map((community) => (
                <CommandItem
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors data-[selected=true]:bg-amber-50 data-[selected=true]:text-amber-700"
                  onSelect={(e) => {
                    router.push(`/c/${e}`);
                    router.refresh();
                  }}
                  key={community.id}
                  value={community.name}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 flex-shrink-0">
                    <Users className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                      c/{community.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {community._count?.subscribers ?? 0} members
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
